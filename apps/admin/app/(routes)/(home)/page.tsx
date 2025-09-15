"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/layout/page-layout";
import { siteConfig } from "@/lib/config/site";
import { api } from "@/trpc/react";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const AdminPage = () => {
  const { data: submissions } = api.submission.getAll.useQuery({});
  const { data: quizzes } = api.quiz.getAll.useQuery({});
  const { data: activities } = api.activity.getAll.useQuery({});
  const { data: errors } = api.errorLog.getAll.useQuery({});

  const avgScore = useMemo(() => {
    if (!submissions?.length) return 0;
    const totalScore = submissions.reduce((acc, sub) => acc + sub.score, 0);
    return Math.round(totalScore / submissions.length);
  }, [submissions]);

  if (!submissions || !quizzes || !activities || !errors) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <Page admin>
      <PageHeader>
        <PageHeaderHeading>Admin Dashboard</PageHeaderHeading>
        <PageHeaderDescription>Overview of submissions, quizzes, and activities.</PageHeaderDescription>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 my-6">
        <Link href={siteConfig.baseLinks.submissions} className="block">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>{submissions.length}</CardContent>
          </Card>
        </Link>

        <Link href={siteConfig.baseLinks.submissions} className="block">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent>{avgScore}</CardContent>
          </Card>
        </Link>

        <Link href={siteConfig.baseLinks.quizzes} className="block">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Live Quizzes</CardTitle>
            </CardHeader>
            <CardContent>{quizzes.filter((q) => q.published).length}</CardContent>
          </Card>
        </Link>

        <Link href={siteConfig.baseLinks.quizzes} className="block">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Total Quizzes</CardTitle>
            </CardHeader>
            <CardContent>{quizzes.length}</CardContent>
          </Card>
        </Link>
      </div>

      {/* Activity Panel */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-2">
          {activities.map((act) => (
            <Card key={act.id}>
              <CardContent>
                <p className="text-muted-foreground">{act.description}</p>
                <p className="text-sm text-muted-foreground">{new Date(act.createdAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Error Logs Panel */}
      <section className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Errors</h2>
        <div className="space-y-2">
          {errors.map((err) => (
            <Card key={err.id} className="border-red-400">
              <CardContent>
                <p className="text-red-600 font-semibold">
                  {err.status} - {err.resource}
                </p>
                <p className="text-muted-foreground">{err.error}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Page>
  );
};

export default AdminPage;
