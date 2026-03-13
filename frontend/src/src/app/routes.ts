import { createBrowserRouter } from "react-router";
import { WireframeOverview } from "./components/WireframeOverview";
import { JobUpload } from "./components/JobUpload";
import { Processing } from "./components/Processing";
import { CandidateRanking } from "./components/CandidateRanking";
import { CandidateDetail } from "./components/CandidateDetail";
import { InterviewQuestions } from "./components/InterviewQuestions";
import { AllScreens } from "./components/AllScreens";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: CandidateRanking,
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
    path: "/processing",
    Component: Processing,
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
  {
    path: "/all-screens",
    Component: AllScreens,
  },
]);
