/**
 * Iconițe inline SVG – nu depind de Iconify/rețea. Folosește acestea peste tot.
 */
const iconClass = 'shrink-0 inline-block';
const defaultSize = 24;

type IconProps = { className?: string; width?: number; height?: number };

function SvgIcon({ children, className, width = defaultSize, height }: IconProps & { children: React.ReactNode }) {
  const h = height ?? width;
  return (
    <svg width={width} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${iconClass} ${className ?? ''}`} aria-hidden>
      {children}
    </svg>
  );
}

function SvgIconFill({ children, className, width = defaultSize, height }: IconProps & { children: React.ReactNode }) {
  const h = height ?? width;
  return (
    <svg width={width} height={h} viewBox="0 0 24 24" fill="currentColor" className={`${iconClass} ${className ?? ''}`} aria-hidden>
      {children}
    </svg>
  );
}

export function HexagonIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
    </SvgIcon>
  );
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </SvgIcon>
  );
}

export function ArrowLeftIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </SvgIcon>
  );
}

export function ZapIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </SvgIcon>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SvgIcon>
  );
}

export function RocketIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </SvgIcon>
  );
}

export function FolderIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </SvgIcon>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </SvgIcon>
  );
}

export function CodeIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </SvgIcon>
  );
}

export function CalendarIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </SvgIcon>
  );
}

export function TargetIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </SvgIcon>
  );
}

export function EyeIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  );
}

export function HeartIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </SvgIcon>
  );
}

export function ShieldCheckIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </SvgIcon>
  );
}

export function CloudIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </SvgIcon>
  );
}

export function CpuIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect width="16" height="16" x="4" y="4" rx="2" ry="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
    </SvgIcon>
  );
}

export function Code2Icon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </SvgIcon>
  );
}

export function DatabaseIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </SvgIcon>
  );
}

export function NetworkIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </SvgIcon>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </SvgIcon>
  );
}

export function MailIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </SvgIcon>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </SvgIcon>
  );
}

export function MapPinIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </SvgIcon>
  );
}

export function LayersIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </SvgIcon>
  );
}

export function XIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </SvgIcon>
  );
}

export function CheckCircleIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m22 4-10 10.01-3-3" />
    </SvgIcon>
  );
}

export function AlertCircleIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </SvgIcon>
  );
}

export function BriefcaseIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
      <path d="M16 6h2a2 2 0 0 1 2 2v2H4V8a2 2 0 0 1 2-2h2" />
    </SvgIcon>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  );
}

export function ChevronDownIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="m6 9 6 6 6-6" />
    </SvgIcon>
  );
}

export function FileTextIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </SvgIcon>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </SvgIcon>
  );
}

export function WorkflowIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect width="8" height="8" x="3" y="3" rx="1" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="1" />
    </SvgIcon>
  );
}

export function BlocksIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <path d="M10 21V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z" />
      <path d="M21 18v-3a1 1 0 0 0-1-1h-6" />
    </SvgIcon>
  );
}

export function BarChart3Icon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </SvgIcon>
  );
}

export function SettingsIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  );
}

export function BookIcon(p: IconProps) {
  return (
    <SvgIcon {...p}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </SvgIcon>
  );
}

/** Map icon name (lucide:xxx or xxx) to component */
const iconMap: Record<string, React.ComponentType<IconProps>> = {
  hexagon: HexagonIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon,
  zap: ZapIcon,
  lock: LockIcon,
  rocket: RocketIcon,
  folder: FolderIcon,
  users: UsersIcon,
  code: CodeIcon,
  calendar: CalendarIcon,
  target: TargetIcon,
  eye: EyeIcon,
  heart: HeartIcon,
  'shield-check': ShieldCheckIcon,
  cloud: CloudIcon,
  cpu: CpuIcon,
  'code-2': Code2Icon,
  database: DatabaseIcon,
  network: NetworkIcon,
  user: UserIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  'map-pin': MapPinIcon,
  layers: LayersIcon,
  x: XIcon,
  'check-circle': CheckCircleIcon,
  'alert-circle': AlertCircleIcon,
  briefcase: BriefcaseIcon,
  clock: ClockIcon,
  'chevron-down': ChevronDownIcon,
  'file-text': FileTextIcon,
  shield: ShieldIcon,
  workflow: WorkflowIcon,
  blocks: BlocksIcon,
  'bar-chart-3': BarChart3Icon,
  settings: SettingsIcon,
  book: BookIcon,
};

export function Icon({ name, ...props }: IconProps & { name: string }) {
  const key = name.replace('lucide:', '');
  const Comp = iconMap[key] || ArrowRightIcon;
  return <Comp {...props} />;
}
