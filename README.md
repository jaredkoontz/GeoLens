[![GeoLens](http://www.cs.colostate.edu/geolens/entry/images/Geolens-logo.png)](http://www.cs.colostate.edu/geolens)





###Intro

This is the client side software for the GeoLens project. It is implemented in javascript using the d3 package. The gap between the java server-side and this client is bridged using json.

###Usage



####Json


###Abstract From Paper

With the rapid increase of scientific data volumes,
interactive tools that enable effective visual representation for
scientists are needed. This is critical when scientists are
manipulating voluminous datasets and especially when they
need to explore datasets interactively to develop their
hypotheses. In this paper, we present an interactive visual
analytics framework, GeoLens. GeoLens provides fast and
expressive interactions with voluminous geo-spatial datasets.
We provide an expressive visual query evaluation scheme to
support advanced interactive visual analytics technique, such
as brushing and linking. To achieve this, we designed and
developed the Geohash based image tile generation algorithm
that automatically adjusts the range of data to access based on
the minimum acceptable size of the image tile. In addition, we
have also designed an autonomous histogram generation
algorithm that generates histograms of user-defined data
subsets that do not have pre-computed data properties. Using
our approach, applications can generate histograms of datasets
containing millions of data points with sub-second latency. The
work builds on our visual query coordinating scheme that
evaluates geo-spatial query and orchestrates data aggregation
in a distributed storage environment while preserving data
locality and minimizing data movements. This paper includes
empirical benchmarks of our framework encompassing a
billion-file dataset published by the National Climactic Data
Center.
