import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

function GenericPage({ title, subtitle }) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p>
      </div>

      <Card className="border-0 bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Static page component for sidebar subcategory routing.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            This route is working and ready for real content.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

export default GenericPage
