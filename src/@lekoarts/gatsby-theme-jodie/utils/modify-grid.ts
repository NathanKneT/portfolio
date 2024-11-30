import type { IGatsbyImageData } from "gatsby-plugin-image"

interface IGridItem {
  slug: string
  title: string
  cover: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
  __typename: "MdxProject" | "MdxPage"
}

const modifyGrid = (data: Array<IGridItem>): Array<IGridItem> => {
  console.log(data,"bagnole")
  
  return data.filter(item => item.slug !== '/biography')
}

export default modifyGrid