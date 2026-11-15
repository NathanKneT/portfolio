import type { IGatsbyImageData } from "gatsby-plugin-image"

interface IGridItem {
  slug: string
  title: string
  cover: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
  category?: string
  __typename: "MdxProject" | "MdxPage"
}

const modifyGrid = (data: Array<IGridItem>): Array<IGridItem> => {
  // Leave out the biography page and the engineering projects
  const filtered = data.filter(item => {
    if (item.slug === '/biography') return false
    
    const isDevProject = item.category?.toLowerCase().includes('dev') || 
                         item.slug.includes('dev-') ||
                         item.title?.toLowerCase().includes('dev')
    
    return !isDevProject
  })
  
  return filtered
}

export default modifyGrid