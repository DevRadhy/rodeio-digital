import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroups } from "../hooks/use-competition";
import type { Competition } from "../types/competition";
import { CompetitionGroup } from "./competition-group";

interface CompetitionViewProps {
  competition: Competition;
}

export function CompetitionView({ competition }: CompetitionViewProps) {
  const [activedGroupId, setActivedGroupId] = useState<string | null>(null);

  const groups = useGroups(competition.id);

  if (groups.isLoading) return;

  if (!groups.data || groups.isError) return;

  const group = groups.data.find((group) => group.id === activedGroupId);

  return (
    <Tabs
      className="px-8"
      defaultValue={activedGroupId}
      onValueChange={(value) => setActivedGroupId(value)}
    >
      <TabsList>
        {groups.data.map((group) => (
          <TabsTrigger value={group.id} key={group.id}>
            {group.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activedGroupId}>
        {!!group && <CompetitionGroup group={group} />}
      </TabsContent>
    </Tabs>
  );
}
