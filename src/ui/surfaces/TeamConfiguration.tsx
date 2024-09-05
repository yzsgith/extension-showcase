import { useNetlifySDK } from "@netlify/sdk/ui/react";
import {
  Card,
  CardLoader,
  CardTitle,
  Form,
  FormField,
  Link,
  TeamConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { SafeTeamSettings } from "../../schema/settings-schema";
import { trpc } from "../trpc";

export const TeamConfiguration = () => {
  const sdk = useNetlifySDK();
  const trpcUtils = trpc.useUtils();
  const teamSettingsQuery = trpc.teamSettings.read.useQuery();
  const teamSettingsMutation = trpc.teamSettings.update.useMutation({
    onSuccess: async () => {
      await trpcUtils.teamSettings.read.invalidate();
    },
  });

  if (teamSettingsQuery.isLoading) {
    return <CardLoader />;
  }

  return (
    <TeamConfigurationSurface>
      <Card>
        <CardTitle>Team-level Configuration for {sdk.extension.name}</CardTitle>
        <Form
          defaultValues={
            teamSettingsQuery.data ?? {
              accountSetting: "",
            }
          }
          schema={SafeTeamSettings}
          onSubmit={teamSettingsMutation.mutateAsync}
        >
          <FormField
            name="accountSetting"
            type="text"
            label="Some account setting"
            helpText="You can put any reasonable string here"
          />
        </Form>
        <hr />
        The code for this surface can be seen here:
        <ul>
          <li>&nbsp;&nbsp;<Link href="https://github.com/netlify/extension-showcase/blob/main/src/ui/surfaces/TeamConfiguration.tsx" target="_blank">React UI code</Link></li>
          <li>&nbsp;&nbsp;<Link href="https://github.com/netlify/extension-showcase/blob/main/src/server/router.ts" target="_blank">Server code</Link></li>
        </ul>
      </Card>
    </TeamConfigurationSurface>
  );
};
