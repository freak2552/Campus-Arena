export type ContentBlockType =
  | "TEXT"
  | "VIDEO"
  | "YOUTUBE"
  | "PDF"
  | "ARTICLE"
  | "IMAGE"
  | "FUN_FACT"
  | "GOOD_TO_KNOW"
  | "COMMON_MISTAKE";

export type ModuleContentBlock = {
  id: number;
  type: ContentBlockType;
  position: number;
  content: string | null;
  url: string | null;
};

export type ModuleTopic = {
  id: number;
  title: string;
  position: number;
  contentBlocks: ModuleContentBlock[];
};

export type StudentModuleDetail = {
  id: number;
  title: string;
  /** 1-based position of this module in the course */
  number: number;
  totalModules: number;
  prevModuleId: number | null;
  nextModuleId: number | null;
  course: {
    id: number;
    title: string;
  };
  topics: ModuleTopic[];
  /** Topics in this module the student has marked as done */
  completedTopicIds: number[];
};
