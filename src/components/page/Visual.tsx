"use client";

import type { ComponentType } from "react";
import type { VisualKey } from "@/content/types";
import { BranchViz, RealtimeViz, RecordViz, RefuseViz } from "@/components/home/viz/StoryViz";
import { EtlViz, MigrateViz } from "@/components/home/Data";
import { AgentCode } from "@/components/home/AgentCode";
import { HaArt, RequestArt, SecureArt, SleepArt, TimeScrub, TrackArt, UndoArt } from "@/components/home/FeatureArt";
import { Architecture } from "./Architecture";
import { ShotFrame } from "./ShotFrame";
import styles from "./Page.module.css";

const screens: Partial<Record<VisualKey, ComponentType>> = { branch: BranchViz, record: RecordViz, realtime: RealtimeViz, refuse: RefuseViz };
const arts: Partial<Record<VisualKey, ComponentType>> = { timescrub: TimeScrub, undo: UndoArt, ha: HaArt, sleep: SleepArt, request: RequestArt, secure: SecureArt, track: TrackArt };

export function Visual({ name }: { name: VisualKey }) {
  const Screen = screens[name];
  if (Screen) {
    return (
      <div className={`${styles.vizScreen} screen`}>
        <Screen />
      </div>
    );
  }
  const Art = arts[name];
  if (Art) {
    return (
      <div className={styles.artCard}>
        <Art />
      </div>
    );
  }
  if (name === "migrate") return <MigrateViz />;
  if (name === "etl") return <EtlViz />;
  if (name === "agentCode") return <AgentCode />;
  if (name === "architecture") return <Architecture />;
  return <ShotFrame />;
}
