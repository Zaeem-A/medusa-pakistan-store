import { STORE_NAME } from "@lib/util/store-name"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading } from "@modules/common/components/ui"

// A plain hero until the content module (backlog item 2.12) lets staff edit
// the homepage.
const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            {STORE_NAME}
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Cash on Delivery available
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button variant="secondary">Shop now</Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
