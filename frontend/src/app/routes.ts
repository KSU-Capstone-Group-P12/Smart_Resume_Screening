import { createBrowserRouter } from "react-router";
import { WireframeOverview } from "./components/WireframeOverview";
import { JobUpload } from "./components/JobUpload";
import { CandidateRanking } from "./components/CandidateRanking";
import { CandidateDetail } from "./components/CandidateDetail";
import { InterviewQuestions } from "./components/InterviewQuestions";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WireframeOverview,
  },
  {
    path: "/dashboard",
    Component: CandidateRanking,
  },
  {
    path: "/overview",
    Component: WireframeOverview,
  },
  {
    path: "/job-upload",
    Component: JobUpload,
  },
  {
    path: "/ranking",
    Component: CandidateRanking,
  },
  {
    path: "/candidate/:id",
    Component: CandidateDetail,
  },
  {
    path: "/interview/:id",
    Component: InterviewQuestions,
  },
  
]);