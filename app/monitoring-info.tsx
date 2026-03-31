import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { EmptyState } from '@/components/empty-state';

export default function MonitoringInfoScreen() {
  return (
    <ScreenShell>
      <TopBar title="Monitoring Info" />
      <EmptyState
        message="This MVP uses an honest local/mock usage layer. It does not claim unrestricted device-wide monitoring or app control on iOS."
        title="Limited by platform"
      />
    </ScreenShell>
  );
}
