import { ActivitiesList } from "@/components/ActivitiesList";

import styles from "./page.module.css";
import SelectLanguage from "@/components/SelectLanguage";

export default function Page() {
  return (
    <div className={styles.main}>
      <SelectLanguage />
      <ActivitiesList />
    </div>
  );
}
