"use client";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StoragePage() {
  return (
    <Container className="overflow-x-auto">
      <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card>
              <CardHeader>
                  <div>
                    <CardTitle className="text-[#3b82f6] text-2xl font-bold">Financeiro</CardTitle>
                    <CardDescription>Cheque todas as informações relacionadas ao financeiro.</CardDescription>
                  </div>
              </CardHeader>
            </Card>
      </TabsContent>
    </Tabs>
  </main>
</Container>
  );
}

