import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useState } from "react";
import { useApiData } from "../hooks/useApiData";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Skeleton,
} from "../components/ui";

type HelpData = {
  faqs: Array<{ question: string; answer: string; category: string }>;
  docs: string[];
};

export default function HelpPage(): JSX.Element {
  const [query, setQuery] = useState("");
  const { data, isLoading, error, reload } = useApiData<HelpData>(
    async () => ({
      faqs: [
        {
          question: "How do I start a stream?",
          answer: "Go to Streams and use Start Stream in the page header.",
          category: "Streaming",
        },
        {
          question: "Where do payouts appear?",
          answer: "Open Earnings to view balances and payout status history.",
          category: "Earnings",
        },
        {
          question: "How can I split revenue?",
          answer:
            "Use AutoSplit Rules to define wallet allocations and percentages.",
          category: "Store",
        },
      ],
      docs: [
        "docs/architecture",
        "docs/earnings",
        "docs/store",
        "docs/engines",
      ],
    }),
    "Could not load help center",
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageSection>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24 w-full" />
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageSection>
            <ErrorState title="Help unavailable" message={error ?? undefined} />
            <Button variant="secondary" onClick={() => void reload()}>
              Retry
            </Button>
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  const normalized = query.trim().toLowerCase();
  const filteredFaqs = data.faqs.filter((faq) => {
    if (!normalized) {
      return true;
    }

    return (
      faq.question.toLowerCase().includes(normalized) ||
      faq.answer.toLowerCase().includes(normalized) ||
      faq.category.toLowerCase().includes(normalized)
    );
  });

  if (filteredFaqs.length === 0) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Help Center"
            subtitle="FAQs, docs shortcuts, and troubleshooting links."
            actions={
              <Button variant="ghost" onClick={() => void reload()}>
                Refresh
              </Button>
            }
          />
          <PageSection>
            <Input
              value={query}
              onChange={setQuery}
              placeholder="Search for payouts, streams, store, or integrations"
            />
            <EmptyState
              title="No help results"
              message="Try a different keyword or browse docs shortcuts below."
            />
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Help Center"
          subtitle="FAQs, docs shortcuts, and troubleshooting links."
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <Input
            value={query}
            onChange={setQuery}
            placeholder="Search for payouts, streams, store, or integrations"
          />
        </PageSection>
        <PageSection>
          <Card title="FAQ" className="metric-card">
            <div className="faq-list">
              {filteredFaqs.map((faq) => (
                <details key={faq.question} className="faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </Card>
          <Card title="Docs Shortcuts" className="metric-card">
            <ul className="activity-list">
              {data.docs.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </Card>
          <Card title="Need More Help" className="metric-card">
            Open Support to submit a creator ticket with severity and category.
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
