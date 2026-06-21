import {
  DashboardLayout,
  PageContainer,
  PageHeader,
  PageSection,
} from "../components/layout";
import { useState } from "react";
import { useApiData } from "../hooks/useApiData";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Skeleton,
  Textarea,
  useToast,
} from "../components/ui";

type SupportBootstrap = {
  status: "operational" | "degraded";
  categories: Array<{ value: string; label: string }>;
  priorities: Array<{ value: string; label: string }>;
};

export default function SupportPage(): JSX.Element {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("billing");
  const [priority, setPriority] = useState("normal");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error, reload } = useApiData<SupportBootstrap>(
    async () => ({
      status: "operational",
      categories: [
        { value: "billing", label: "Billing" },
        { value: "streaming", label: "Streaming" },
        { value: "store", label: "Store" },
        { value: "integrations", label: "Integrations" },
      ],
      priorities: [
        { value: "low", label: "Low" },
        { value: "normal", label: "Normal" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    }),
    "Could not load support center",
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
            <ErrorState
              title="Support unavailable"
              message={error ?? undefined}
            />
            <Button variant="secondary" onClick={() => void reload()}>
              Retry
            </Button>
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  if (data.categories.length === 0 || data.priorities.length === 0) {
    return (
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Support"
            subtitle="Open a ticket and connect to creator success channels."
          />
          <PageSection>
            <EmptyState
              title="Support options unavailable"
              message="Support routing options are temporarily unavailable. Please retry shortly."
            />
            <Button variant="secondary" onClick={() => void reload()}>
              Retry
            </Button>
          </PageSection>
        </PageContainer>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (event: {
    preventDefault: () => void;
  }): Promise<void> => {
    event.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast({
        message: "Please complete name, email, and message before submitting.",
        type: "error",
      });
      return;
    }

    if (!emailPattern.test(email.trim())) {
      addToast({
        message: "Please provide a valid email address.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.resolve();
      setName("");
      setEmail("");
      setMessage("");
      addToast({ message: "Support ticket submitted successfully." });
    } catch {
      addToast({ message: "Failed to submit support ticket.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Support"
          subtitle="Open a ticket and connect to creator success channels."
          actions={
            <Button variant="ghost" onClick={() => void reload()}>
              Refresh
            </Button>
          }
        />
        <PageSection>
          <div className="status-banner">
            <Badge
              text={
                data.status === "operational"
                  ? "System Operational"
                  : "Service Degraded"
              }
              variant={data.status === "operational" ? "success" : "warning"}
            />
            <span className="status-copy">
              Current support response window: under 4 hours for high priority.
            </span>
          </div>
        </PageSection>
        <PageSection>
          <Card title="Submit Support Ticket" className="metric-card">
            <form
              className="support-form"
              onSubmit={(event: { preventDefault: () => void }) =>
                void handleSubmit(event)
              }
              noValidate
            >
              <div className="support-form-grid">
                <Input
                  value={name}
                  onChange={setName}
                  placeholder="Your name"
                  ariaLabel="Full name (required)"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@creator.com"
                  ariaLabel="Email address (required)"
                />
              </div>
              <div className="support-form-grid">
                <Select
                  value={category}
                  onChange={setCategory}
                  options={data.categories}
                  ariaLabel="Ticket category"
                />
                <Select
                  value={priority}
                  onChange={setPriority}
                  options={data.priorities}
                  ariaLabel="Ticket priority"
                />
              </div>
              <Textarea
                value={message}
                onChange={setMessage}
                placeholder="Add additional context, steps, and impact details."
                ariaLabel="Issue description (required)"
              />
              <div className="support-upload">
                Attachment UI placeholder: logs, screenshots, clips.
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </Card>
        </PageSection>
      </PageContainer>
    </DashboardLayout>
  );
}
