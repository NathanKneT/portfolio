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
  console.log("Données avant filtrage:", data)
  
  // Filtrer pour exclure biography ET les projets dev
  const filtered = data.filter(item => {
    // Exclure la page biography
    if (item.slug === '/biography') return false
    
    const isDevProject = item.category?.toLowerCase().includes('dev') || 
                         item.slug.includes('dev-') ||
                         item.title?.toLowerCase().includes('dev')
    
    console.log(`Projet: ${item.title}, slug: ${item.slug}, category: ${item.category}, isDevProject: ${isDevProject}`)
    
    return !isDevProject
  })
  
  console.log("Données après filtrage:", filtered)
  return filtered
}

export default modifyGrid