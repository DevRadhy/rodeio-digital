import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroups } from "../hooks/use-competition";
import type { Competition } from "../types/competition";
import { CompetitionGroup } from "./competition-group";

interface CompetitionViewProps {
  competition: Competition;
}

export function CompetitionView({ competition }: CompetitionViewProps) {
  const groups = useGroups(competition.id);

  const [activedGroupId, setActivedGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (!activedGroupId && groups.data?.length) {
      setActivedGroupId(groups.data[0].id);
    }
  }, [groups.data, activedGroupId]);

  if (groups.isLoading) return;

  if (!groups.data || groups.isError) return;

  return (
    <Tabs
      className="px-8"
      value={activedGroupId}
      onValueChange={(value) => setActivedGroupId(value)}
    >
      <TabsList>
        {groups.data.map((group) => (
          <TabsTrigger value={group.id} key={group.id}>
            {group.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.data.map((group) => (
        <TabsContent value={group.id} key={group.id}>
          <CompetitionGroup group={group} competition={competition} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
