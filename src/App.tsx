import { Authenticated, CanAccess, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
  NavigateToResource,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/dashboard";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import "./App.css";
import ClassesCreate from "./pages/classes/create";
import ClassesList from "./pages/classes/list";
import { authProvider } from "./providers/auth";
import { Register } from "./pages/register";
import { Login } from "./pages/login";
import { accessControlProvider } from "./providers/access-control";
import ClassesEdit from "./pages/classes/edit";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider} // add this
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "7aotcb-y7H8dh-cTap2t",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Home", icon: <Home /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  meta: { label: "Subjects", icon: <BookOpen /> },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  edit: "/classes/edit/:id",
                  meta: { label: "Classes", icon: <GraduationCap /> },
                },
              ]}
            >
              <Routes>
                {/* <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                > */}
                <Route
                  element={
                    <Authenticated key="public-routes" fallback={<Outlet />}>
                      <NavigateToResource fallbackTo="/" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="private-routes" fallback={<Login />}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  {/* <Route path="/" element={<Dashboard />} /> */}
                  <Route
                    path="/"
                    element={
                      <CanAccess
                        resource="dashboard"
                        action="list"
                        fallback={<Navigate to="/classes" replace />}
                      >
                        <Dashboard />
                      </CanAccess>
                    }
                  />

                  {/* <Route path="/subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                  </Route> */}
                  <Route path="/subjects">
                    <Route
                      index
                      element={
                        <CanAccess
                          resource="subjects"
                          action="list"
                          fallback={<Navigate to="/classes" replace />}
                        >
                          <SubjectsList />
                        </CanAccess>
                      }
                    />
                    <Route
                      path="create"
                      element={
                        <CanAccess
                          resource="subjects"
                          action="create"
                          fallback={<Navigate to="/classes" replace />}
                        >
                          <SubjectsCreate />
                        </CanAccess>
                      }
                    />
                  </Route>

                  {/* <Route path="/classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                  </Route> */}
                  <Route path="/classes">
                    <Route index element={<ClassesList />} />
                    <Route
                      path="create"
                      element={
                        <CanAccess
                          resource="classes"
                          action="create"
                          fallback={<Navigate to="/classes" replace />}
                        >
                          <ClassesCreate />
                        </CanAccess>
                      }
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <CanAccess
                          resource="classes"
                          action="edit"
                          fallback={<Navigate to="/classes" replace />}
                        >
                          <ClassesEdit />
                        </CanAccess>
                      }
                    />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
