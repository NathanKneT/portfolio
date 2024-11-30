import React from "react";
import { useThemeUI, get } from "theme-ui"
import { readableColor } from "polished"
import useSiteMetadata from "../hooks/use-site-metadata"

const Footer = ({ bg }: { bg: string }) => {
  const { siteTitle } = useSiteMetadata()
  const {
    theme: { rawColors },
  } = useThemeUI()

  const text = readableColor(
    bg,
    rawColors!.textMuted as string | undefined,
    rawColors!.textMutedLight as string | undefined
  )

  return (
    <footer>
    </footer>
  )
}

export default Footer