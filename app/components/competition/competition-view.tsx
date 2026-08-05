import { CompetitionService } from "@/services/competition-service";
import { useCompetitionSessionStore } from "@/stores/competition";
import type { Category } from "@/types/category";
import type { Competition } from "@/types/competition";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CompetitionFooter } from "./competition-footer";
import { CompetitionHeader } from "./competition-header";
import { CompetitionList } from "./competition-list";

interface CompetitionViewProps {
  category: Category;
  competition: Competition;
}

export function CompetitionView({
  category,
  competition,
}: CompetitionViewProps) {
  const { updateCompetition } = useCompetitionSessionStore();

  const groups = competition.groups;
  const isAllQualifieds = competition.groups.every(
    (group) => group.status === "finished",
  );

  const handleFinish = () => {
    const finish = CompetitionService.finishQualification(
      competition,
      category,
    );

    console.log(finish);

    updateCompetition(finish);
  };

  return (
    <>
      <Tabs className="px-8">
        <TabsList>
          {groups.map((group) => (
            <TabsTrigger value={group.id} key={group.id}>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {groups.map((group) => (
          <TabsContent value={group.id} key={group.id}>
            <CompetitionHeader
              competition={competition}
              category={category}
              group={group}
            />

            <CompetitionList group={group} />

            <CompetitionFooter
              competition={competition}
              group={group}
              category={category}
            />
          </TabsContent>
        ))}
      </Tabs>

      {isAllQualifieds && (
        <Button
          disabled={!isAllQualifieds}
          variant={"default"}
          onClick={() => handleFinish()}
        >
          Iniciar Finais
        </Button>
      )}
    </>
  );
}
