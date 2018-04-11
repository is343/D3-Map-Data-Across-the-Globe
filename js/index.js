var w = 1000;
      var h = 480;

      var projection = d3.geoEquirectangular()

      var path = d3.geoPath()
        .projection(projection);

      var svg = d3.select('body')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
      svg.append('rect')
        .attr('width', w)
        .attr('height', h)
        .attr('fill', '#266D98');

      var g = svg.append("g");

      d3.json('https://d3js.org/world-50m.v1.json', function (error, data) {
        if (error) console.error(error);
        g.append('path')
          .datum(topojson.feature(data, data.objects.countries))
          .attr('d', path);

        var zoom = d3.zoom()
          .on("zoom", function () {
            g.attr("transform", d3.event.transform);
            g.selectAll("path")
              .attr("d", path.projection(projection));
          });
          
        svg.call(zoom);

        d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function (error, data) {
          if (error)
            console.error(error);

          var locations = data.features;
          var hue = 0;



          locations.map(function (d) { 
            hue += 0.36;
            d.color = 'hsl(' + hue + ', 100%, 50%)';
          });

          g.selectAll('circle')
            .data(locations)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
              if (d.geometry) {
                return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
              }
            })
            .attr('cy', function (d) {
              if (d.geometry) {
                return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
              }
            })
            .attr('r', function (d) {
              if (d.properties.mass) {
                return Math.pow(parseInt(d.properties.mass), 1 / 6);
              }
            })
            .style('fill', function (d) {
              return d.color;
            })

            .on('mouseover', function (d) {
              d3.select(this).style('fill', 'black');
              d3.select('#name').text(d.properties.name);
              d3.select('#nametype').text(d.properties.nametype);
              d3.select('#fall').text(d.properties.fall);
              d3.select('#mass').text(d.properties.mass);
              d3.select('#recclass').text(d.properties.recclass);
              d3.select('#reclat').text(d.properties.reclat);
              d3.select('#reclong').text(d.properties.reclong);
              d3.select('#year').text(d.properties.year);
              d3.select('#tooltip')
                .style('left', (d3.event.pageX + 20) + 'px')
                .style('top', (d3.event.pageY - 80) + 'px')
                .style('display', 'block')
                .style('opacity', 0.8)
            })
            
            .on('mouseout', function (d) {
              d3.select(this).style('fill', d.color);
              d3.select('#tooltip')
                .style('display', 'none');
            });
        });
      });