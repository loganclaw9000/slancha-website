import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getRequiredEnvVars } from './generateRouterYaml';

/**
 * Generates a client-side ZIP bundle for local Minikube deployment
 * of the vLLM Semantic Router configuration.
 */
export async function generateMinikubeBundle({ yaml, providers = [] }) {
  const zip = new JSZip();
  const envVars = getRequiredEnvVars(providers);

  // 1. Router config
  zip.file('config.yaml', yaml);

  // 2. .env.template
  const envLines = [
    '# Slancha Semantic Router — Environment Variables',
    '# Fill in your API keys below before deploying.',
    '',
    ...envVars.map(v => `${v}=your-key-here`),
    '',
    '# Local vLLM endpoint (no key needed)',
    'SLANCHA_VLLM_ENDPOINT=http://localhost:8000/v1',
    '',
  ];
  zip.file('.env.template', envLines.join('\n'));

  // 3. K8s manifests
  const k8s = zip.folder('k8s');

  k8s.file('configmap.yaml', `apiVersion: v1
kind: ConfigMap
metadata:
  name: slancha-router-config
  namespace: default
data:
  config.yaml: |
${yaml.split('\n').map(l => '    ' + l).join('\n')}
`);

  k8s.file('secret.yaml', `apiVersion: v1
kind: Secret
metadata:
  name: slancha-router-secrets
  namespace: default
type: Opaque
stringData:
${envVars.map(v => `  ${v}: "your-key-here"`).join('\n')}
`);

  k8s.file('deployment.yaml', `apiVersion: apps/v1
kind: Deployment
metadata:
  name: slancha-semantic-router
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: slancha-router
  template:
    metadata:
      labels:
        app: slancha-router
    spec:
      containers:
        - name: router
          image: vllm/semantic-router:latest
          ports:
            - containerPort: 8080
          envFrom:
            - secretRef:
                name: slancha-router-secrets
          volumeMounts:
            - name: config
              mountPath: /app/config
              readOnly: true
      volumes:
        - name: config
          configMap:
            name: slancha-router-config
`);

  k8s.file('service.yaml', `apiVersion: v1
kind: Service
metadata:
  name: slancha-router
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: slancha-router
  ports:
    - port: 8080
      targetPort: 8080
      protocol: TCP
`);

  // 4. values.yaml (Helm)
  zip.file('values.yaml', `# Helm values for vLLM Production Stack
replicaCount: 1

router:
  enabled: true
  configPath: /app/config/config.yaml

resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "2000m"
    memory: "2Gi"

service:
  type: ClusterIP
  port: 8080
`);

  // 5. test.sh
  zip.file('test.sh', `#!/bin/bash
# Test the Slancha Semantic Router deployment
echo "Testing Slancha Semantic Router..."
echo ""

# Port-forward if running in Minikube
# kubectl port-forward svc/slancha-router 8080:8080 &

curl -s http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "What is 2+2?"}]
  }' | python3 -m json.tool

echo ""
echo "Health check:"
curl -s http://localhost:8080/health
echo ""
`);

  // 6. README.md
  zip.file('README.md', `# Slancha Semantic Router — Minikube Deployment

## Prerequisites
- [minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- [Helm](https://helm.sh/docs/intro/install/) installed (optional, for vLLM stack)

## Quick Start

### 1. Start Minikube
\`\`\`bash
minikube start --cpus=4 --memory=8g
\`\`\`

### 2. Fill in your API keys
\`\`\`bash
cp .env.template .env
# Edit .env and add your actual API keys
\`\`\`

### 3. Create Kubernetes secrets
\`\`\`bash
kubectl create secret generic slancha-router-secrets --from-env-file=.env
\`\`\`

### 4. Deploy the router config
\`\`\`bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
\`\`\`

### 5. (Optional) Install vLLM Production Stack via Helm
\`\`\`bash
helm repo add vllm https://vllm-project.github.io/production-stack
helm install vllm-stack vllm/vllm-stack -f values.yaml
\`\`\`

### 6. Port-forward and test
\`\`\`bash
kubectl port-forward svc/slancha-router 8080:8080
bash test.sh
\`\`\`

## Files
| File | Purpose |
|------|---------|
| \`config.yaml\` | Semantic Router configuration |
| \`.env.template\` | API key placeholders — copy to \`.env\` |
| \`values.yaml\` | Helm values for vLLM production stack |
| \`k8s/deployment.yaml\` | Router deployment manifest |
| \`k8s/service.yaml\` | Router service manifest |
| \`k8s/configmap.yaml\` | ConfigMap with router config |
| \`k8s/secret.yaml\` | Secret template (use \`--from-env-file\` instead) |
| \`test.sh\` | Sample curl test script |

## Support
Visit [slancha.com](https://slancha.com) for documentation and support.
`);

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'slancha-minikube-bundle.zip');
}

export default generateMinikubeBundle;
