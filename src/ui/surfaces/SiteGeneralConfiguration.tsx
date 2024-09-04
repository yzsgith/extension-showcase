import { useNetlifySDK } from "@netlify/sdk/ui/react";
import {
  Card,
  CardLoader,
  CardTitle,
  Checkbox,
  Form,
  FormField,
  SiteGeneralConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { trpc } from "../trpc";
import { SiteSettings } from "../../schema/settings-schema";

export const SiteGeneralConfiguration = () => {
  const sdk = useNetlifySDK();
  const trpcUtils = trpc.useUtils();
  const siteSettingsQuery = trpc.siteSettings.read.useQuery();
  const siteSettingsMutation = trpc.siteSettings.update.useMutation({
    onSuccess: async () => {
      await trpcUtils.siteSettings.read.invalidate();
    },
  });

  if (siteSettingsQuery.isLoading) {
    return <CardLoader />;
  }

  return (
    <SiteGeneralConfigurationSurface>
      <Card>
        <CardTitle>Site-level Configuration for {sdk.extension.name}</CardTitle>
        <br />
        <Form
          defaultValues={
            siteSettingsQuery.data ?? {
              enabled: false,
              siteSetting: "",
            }
          }
          schema={SiteSettings}
          onSubmit={siteSettingsMutation.mutateAsync}
        >
          <Checkbox
            name="enabled"
            label="Enabled for site?"
            helpText="Turn this on to enable build modification for this site."
          />
          <FormField
            name="siteSetting"
            type="text"
            label="Some site setting"
            helpText="You can put any reasonable string here"
          />
        </Form>
      </Card>
    </SiteGeneralConfigurationSurface>
  );
};