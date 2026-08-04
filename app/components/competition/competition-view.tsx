import type { Category } from "@/types/category";
import type { Competition } from "@/types/competition";
import { CompetitionHeader } from "./competition-header";
import { CompetitionList } from "./competition-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CompetitionFooter } from "./competition-footer";

interface CompetitionViewProps {
  category: Category;
  competition: Competition;
}

export function CompetitionView({
  category,
  competition,
}: CompetitionViewProps) {
  const groups = competition.groups;

  return (
    <Tabs className="px-8">
      <TabsList>
        {groups.map((group) => (
          <TabsTrigger value={group.id}>{group.name}</TabsTrigger>
        ))}
      </TabsList>
      {groups.map((group) => (
        <TabsContent value={group.id} key={group.id}>
          <CompetitionHeader
            category={category}
            group={group}
          />

          <CompetitionList
            group={group}
          />

          <CompetitionFooter
            competition={competition}
            group={group}
            category={category}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
