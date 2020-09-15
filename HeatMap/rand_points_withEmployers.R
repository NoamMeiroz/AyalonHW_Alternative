# load libraries
library(sf)
library(tmap)
library(tidyverse)
library(tmaptools)
library(jsonlite)

# set tmap mode
tmap_mode('view')

# load layer
query <- 'https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/510/query?where=k_rova+%3D+3&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=geojson'

# load data
rova_3 <- st_read(query)

# generate random locations
rand_points <- st_sample(rova_3,2000)

# quick map
qtm(rand_points)

# parse to sf
rand_points <- st_as_sf(rand_points)

# specify number of companies
kk <-  5

# allocate each point to a random employer
randomDraw <- rnorm(nrow(rand_points))
kQuantiles <- quantile(randomDraw, 0:kk/kk)
whichK <- cut(randomDraw, kQuantiles, include.lowest = TRUE)  # Divide randomDraw into kk equally-sized groups
levels(whichK) <- c('Google','Bank Leumi','Osem','Teva','Shufersal')  # (Optionally) Give the levels handier names

# merge
rand_points$employer <- whichK

# add xy data
rand_points$X <- st_coordinates(rand_points)[,'X']
rand_points$Y <- st_coordinates(rand_points)[,'Y']

# add ID
rand_points$ID <- 1:nrow(rand_points)

# create object to export
export <- as.data.frame(rand_points)[,c('ID','employer','X','Y')]

# export to json
jsonlite::stream_out(export, file('tmp.json'))

st_bbox(rand_points)


