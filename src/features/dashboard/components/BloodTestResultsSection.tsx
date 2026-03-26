import { FlaskConical } from "lucide-react";
import { BloodTestCard } from "./BloodTestCard";
import { bloodTestsData } from "../data/mockData";

export function BloodTestResultsSection() {
  return (
    <section className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <FlaskConical size={18} className="text-muted-foreground" />
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-foreground">Blood Test Results</h2>
          <p className="text-xs text-muted-foreground">
            Latest lab results with AI-powered interpretation
          </p>
        </div>
      </div>

      {/* Test cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bloodTestsData.map((test) => (
          <BloodTestCard key={test.id} test={test} />
        ))}
      </div>
    </section>
  );
}
