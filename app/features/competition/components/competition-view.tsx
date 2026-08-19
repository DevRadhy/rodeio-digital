import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompetitionState } from "../types/competition";
import { CompetitionHeader } from "./competition-header";
import { CompetitionList } from "./competition-list";

interface CompetitionViewProps {
  competition: CompetitionState;
}

export function CompetitionView({ competition }: CompetitionViewProps) {
  return (
    <Tabs className="px-8">
      <TabsList>
        {competition.groups.map((group) => (
          <TabsTrigger value={group.id} key={group.id}>
            {group.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {competition.groups.map((group) => (
        <TabsContent value={group.id} key={group.id}>
          <CompetitionHeader competition={competition} group={group} />

          <CompetitionList group={group} />

          {/* <CompetitionFooter
            competition={competition}
            group={group}
            category={category}
          /> */}
        </TabsContent>
      ))}
    </Tabs>
  );
}
