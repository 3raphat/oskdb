import { getServerAuthSession } from "@/server/auth"

export default async function Home() {
  const session = await getServerAuthSession()

  return (
    <main className="">
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </main>
  )
}
