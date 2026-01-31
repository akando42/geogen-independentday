import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'


export function getSortedPostsData(postsDirectory) {
  // console.log("parsing Markdown post from", postsDirectory)
  
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const postNames = fileNames.filter(file => file !== ".DS_Store")
  
  // console.log(
  //   "Files in our directory ",
  //   postsDirectory, 
  //   "are: \n", 
  //   fileNames
  // )

  const allPostsData = postNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)

    const topic = postsDirectory.split("/").pop()
    // console.log(topic)

    // Read File Sync (if on there are files)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      topic,
      ...matterResult.data
    }
  })

  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
    }
  })
}

export function getAllPostIds(postsDirectory) {
  const fileNames = fs.readdirSync(postsDirectory)
  const postNames = fileNames.filter(file => file !== ".DS_Store")
  // console.log("Files in this directory ", postsDirectory, "\n ", fileNames);
  // Modifying and Updating Sitemap HERE 

  return postNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(postsDirectory, id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // console.log("POST FULL PATH", fullPath)
  // console.log("FILE CONTENT",fileContents)

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
  // console.log("Matter ",matterResult)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content)

  // console.log(
  //   "Processed Content ", 
  //   processedContent
  // )

  const contentHtml = processedContent.toString()

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}

export function getSortedDates(dateDirectory){
    const dateNations = fs.readdirSync(dateDirectory)
    let contentPath = []
    let dates = dateNations
      .filter(dateNation => dateNation !== "DS_Store")
      .map(dateNation => {
        let path = dateDirectory + "/" + dateNation
        let files = fs.readdirSync(path).filter(file => file !== "research.md")
        // console.log("FILES ", files)

        let city = files[0].replace(/\.md$/, '')
        let fullPath = path + "/" + files[0]
        // contentPath.push(fullPath)

        return {
          independent_date: dateNation,
          city: city,
          full_path: fullPath
        }
    })
    
    // console.log("Dates ", dates)
    return dates
}

export function getSortedCities(cityDirectory){
  const expSteps = fs.readdirSync(cityDirectory)
    .filter(step => (step !== ".DS_Store"))

  
  let sign = cityDirectory.split("/")[4]
  console.log("Steps" , cityDirectory, sign)

  let the_cities = []

  let steps = expSteps.map(step => {
    let path = cityDirectory + "/"+step

    let cities = fs.readdirSync(path).map(city => {
      let city_name = city.replace(/\.md$/, '')
      let tactic = step.slice(3)
      return {
        city: city_name.replace(/_/g, ' '),
        tactic: tactic,
        path: "/posts/"+sign+"/"+step+"/"+city_name
      }
    })

    the_cities = the_cities.concat(cities)

    return {
      tactic: step,
      cities: cities
    }
  })

  return {
    steps: steps,
    cities: the_cities
  }
}

export function getCityData(postsDirectory, id){
  console.log(postsDirectory, id)
}