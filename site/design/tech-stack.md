# Design Spec — Tech Stack Section

## Layout
- Centered, max-width 800px, margin 0 auto, padding 64px
- Text-align center throughout

## Section Label (above heading)
- Text: "BUILT ON"
- Font-size 11px, font-family monospace ("Source Code Pro", monospace)
- Color: #5E6C84, letter-spacing 0.12em, text-transform uppercase
- Margin-bottom 16px

## Heading
- Font-size 28px, font-weight 600, color #E5E7EB
- Margin-bottom 20px

## Body Text
- Font-size 16px, color #A0AEC0, line-height 1.7
- Max-width 580px, margin 0 auto 32px

## Tech Pills
- Display: flex, flex-wrap wrap, gap 8px, justify-content center
- Margin-bottom 20px
- Pills: TensorRT / TensorRT-LLM / vLLM / ONNX / llmcompressor
- Each pill:
  - Background: #1A1A1A
  - Border: 1px solid #262626
  - Border-radius: 4px
  - Padding: 6px 14px
  - Font-size 13px, font-family monospace, color #A0AEC0

## Footer Line
- Font-size 12px, color #5E6C84, font-style italic
- Text: "Slancha's control plane selects and composes these automatically."
