// Mock React Router
import * as reactRouterDom from 'react-router-dom';

const actualReactRouter = jest.requireActual('react-router-dom');

export const mockNavigate = jest.fn();
export const mockUseParams = jest.fn();
export const mockUseLocation = jest.fn();

export * from 'react-router-dom';

export const useNavigate = () => mockNavigate;
export const useParams = () => mockUseParams();
export const useLocation = () => mockUseLocation();
