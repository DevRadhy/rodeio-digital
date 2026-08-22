import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroupRegistrations, useGroups } from "../hooks/use-competition";
import type { Competition } from "../types/competition";
import { CompetitionList } from "./competition-list";

interface CompetitionViewProps {
  competition: Competition;
}

export function CompetitionView({ competition }: CompetitionViewProps) {
  const { data: groups = [] } = useGroups(competition.id);
  const [activedGroupId, setActivedGroupId] = useState(null);

  const { data: groupRegistrations = [] } = useGroupRegistrations(
    competition.id,
    String(activedGroupId),
  );

  const group = groups.find((group) => group.id === activedGroupId);

  return (
    <Tabs
      className="px-8"
      defaultValue={activedGroupId}
      onValueChange={(value) => setActivedGroupId(value)}
    >
      <TabsList>
        {groups.map((group) => (
          <TabsTrigger value={group.id} key={group.id}>
            {group.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activedGroupId}>
        {/* <CompetitionHeader group={group} /> */}

        {!!group && (
          <CompetitionList group={group} registrations={groupRegistrations} />
        )}

        {/* <CompetitionFooter
          competition={competition}
          group={group}
          category={category}
        /> */}
      </TabsContent>
    </Tabs>
  );
}
