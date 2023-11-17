import GroupsHomeworkView from "@/views/groups-homework-view";

export default function GroupsHomework({ params }) {
  return <GroupsHomeworkView zadaca={params.id} />;
}
