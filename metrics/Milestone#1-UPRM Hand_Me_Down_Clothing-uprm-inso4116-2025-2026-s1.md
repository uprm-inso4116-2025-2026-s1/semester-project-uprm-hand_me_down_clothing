# Milestone Data

## Date Generated: 2025-09-02
| Developer | Points Closed | Percent Contribution | Indivudal Grade | Milestone Grade | Lecture Topic Tasks |
| --------- | ------------- | -------------------- | --------------- | --------------- | ------------------- |
| Total | 0 | /100% | /100% | /100% | 0 |


## Sprint Task Completion

| Developer | Sprint 1<br>2025/09/02, 12:24 PM<br>2025/09/02, 12:24 PM | Sprint 2<br>2025/09/02, 12:24 PM<br>2025/09/02, 12:24 PM |
|---|---|---|

## Weekly Discussion Participation

| Developer | Week #1 | Week #2 | Week #3 | Week #4 | Penalty |
|---|---|---|---|---|---|

## Point Percent by Label

# Metrics Generation Logs

| Message |
| ------- |
| WARNING: Milestone "Milestone #1" not found in any repo associated with the team |
| ERROR: Project Board with name UPRM Hand_Me_Down_Clothing not found in organization. Ensure that all the team's issues are listed in a board with this *exact* name. |
| Traceback (most recent call last): |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateMilestoneMetricsForActions.py", line 100, in generateMetricsFromV2Config |
|     team_metrics = getTeamMetricsForMilestone( |
|                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/opt/hostedtoolcache/Python/3.11.13/x64/lib/python3.11/concurrent/futures/thread.py", line 58, in run |
|     result = self.fn(*self.args, **self.kwargs) |
|              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateTeamMetrics.py", line 301, in getLectureTopicTaskMetricsFromIssues |
|     for issue in issues: |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateTeamMetrics.py", line 376, in queueIteratorNext |
|     raise value |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateTeamMetrics.py", line 477, in getTeamMetricsForMilestone |
|     for issue in getIteratorFromQueue(issueMetricsQueue): |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateTeamMetrics.py", line 376, in queueIteratorNext |
|     raise value |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateTeamMetrics.py", line 358, in iteratorSplitter |
|     for item in iterator: |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateTeamMetrics.py", line 234, in fetchProcessedIssues |
|     for issue_dict in fetchIssuesFromGithub(org=org, team=team, logger=logger): |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/generateTeamMetrics.py", line 174, in fetchIssuesFromGithub |
|     project = getProject(organization=org, project_name=team) |
|               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ |
|   File "/home/runner/work/semester-project-uprm-hand_me_down_clothing/semester-project-uprm-hand_me_down_clothing/inso-gh-query-metrics/src/getProject.py", line 42, in getProject |
|     raise ValueError( |
| ValueError: Project Board with name UPRM Hand_Me_Down_Clothing not found in organization. Ensure that all the team's issues are listed in a board with this *exact* name. |
