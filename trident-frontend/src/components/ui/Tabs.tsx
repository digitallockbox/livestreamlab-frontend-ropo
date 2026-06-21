import { useState } from "react";
import tabsStyles from "./Tabs.module.css";

type TabItem = {
  id: string;
  label: string;
  content: JSX.Element;
};

type TabsProps = {
  tabs: TabItem[];
};

export function Tabs({ tabs }: TabsProps): JSX.Element {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div className={tabsStyles.tabs}>
      <div className={tabsStyles.list}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${tabsStyles.trigger} ${tab.id === activeId ? tabsStyles.triggerActive : ""}`}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab?.content}
    </div>
  );
}
