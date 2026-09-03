import { QualificationReview } from "./qualification-review";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    const activeGroupInGroups = groups.data?.some(
      (group) => group.id === activedGroupId,
    );

    if (!groups.data?.length) return;

    if (!activedGroupId || !activeGroupInGroups) {
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
      <QualificationReview competition={competition} />
      <div
        className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Resumo dos grupos"
      >
        {groups.data.map((group) => (
          <Card
            key={group.id}
            size="sm"
            className={group.id === activedGroupId ? "border-primary" : ""}
          >
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {competition.phase === "final"
                      ? "Classificados"
                      : "Inscrições"}
                  </dt>
                  <dd className="text-2xl font-bold font-mono tabular-nums">
                    {group.totalRegistrationCount ?? 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Inscrições ativas
                  </dt>
                  <dd className="text-2xl font-bold font-mono tabular-nums text-primary">
                    {group.activeRegistrationCount ?? 0}
                  </dd>
                </div>
              </dl>
              {competition.phase === "final" &&
                group.totalRegistrationCount === 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {competition.category.categoryType === "duel"
                      ? "Nenhum competidor classificou nesta força."
                      : "Nenhum competidor classificou neste grupo de final."}
                  </p>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
      <TabsList className="h-auto flex-wrap">
        {groups.data.map((group) => (
          <TabsTrigger value={group.id} key={group.id}>
            {group.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.data.map((group, index) => (
        <TabsContent value={group.id} key={group.id}>
          <CompetitionGroup
            group={group}
            competition={competition}
            groupIndex={index + 1}
            groupCount={groups.data.length}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
