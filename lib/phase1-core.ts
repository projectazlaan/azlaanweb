export { createFreedomBridge, useFreedomBridge, createSandboxedIframe, validateParentOrigin } from './freedom-bridge'
export type { FreedomBridgeConfig, FreedomMessage, FreedomBridgeAPI } from './freedom-bridge'

export { 
  useBreakpoint, 
  useMediaQuery, 
  useAboveBreakpoint, 
  useBelowBreakpoint, 
  useBetweenBreakpoint,
  useResponsiveValue,
  BreakpointManager,
  getDeviceBreakpoint,
  getBreakpointForWidth,
  BREAKPOINTS,
  DEVICE_BREAKPOINTS
} from './breakpoint-manager'
export type { Breakpoint, BreakpointState, DeviceType } from './breakpoint-manager'

export { 
  generateClamp, 
  generateFluidCSS, 
  getFluidValue,
  generateFluidSpacing,
  generateFluidMarginPadding,
  FLUID_TYPOGRAPHY_PRESET,
  TYPOGRAPHY_SCALES
} from './fluid-typography'
export type { TypographyScale, FluidTypographyConfig, GeneratedClamp } from './fluid-typography'

export { 
  useSandboxedIframe,
  createSecureIframe,
  generateCSPHeader,
  createCSPPolicy,
  generateSecurityHeaders,
  validateOrigin,
  SandboxedIframe,
  SecurityHeadersComponent,
  createIframeBridge,
  DEFAULT_CSP_POLICY,
  STRICT_CSP_POLICY,
  PERMISSIVE_CSP_POLICY
} from './iframe-sandbox'
export type { IframeSandboxConfig, CSPPolicy, SecurityHeaders } from './iframe-sandbox'