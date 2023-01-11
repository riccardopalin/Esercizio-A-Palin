const svgEl = document.getElementById('chart')
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const padding = 100
const svg = d3.select('#chart')
const color1 = '#87CEFA'
const color2 = '#FF8400'
const textColor = '#194d30'
const ticks = 22

const hpadding = 45
const wpadding = 80

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
	var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0

	return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	}
}

const describeArc = (x, y, radius, startAngle, endAngle) => {

	var start = polarToCartesian(x, y, radius, endAngle)
	var end = polarToCartesian(x, y, radius, startAngle)

	var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

	var d = [
	    "M", start.x, start.y, 
	    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ")

	return d + `L ${x} ${y} Z`       
}



const data = d3.csvParse(dataset, d => {
	return {
		companyType : d.companyType,
		nCompanies : +d.nCompanies,
		percControlled : +d.percControlled,
		evasion : +d.evasion
	}
})

const xScale=d3.scaleLinear()
	.domain([0,data.length])
	.range([wpadding,width-wpadding])


const yScale=d3.scaleLinear()
	.domain([0,(d3.max(data, d => d.evasion)/22) +d3.max(data, d => d.evasion)])
	.range([height-hpadding,hpadding])

const yAxis=d3.axisLeft(yScale)
	.ticks(ticks)
	.tickSize(-(width-(wpadding*2)))


const yTicks = svg
	.append('g')
	.attr('transform', `translate(${wpadding}, 0)`)
	.call(yAxis)



const Radius = (width /  (data.length + 20))  

svg
	.selectAll('.tick line')
	.style('stroke', '#D3D3D3')


svg
	.selectAll('.tick text')
	.style('color', textColor)


svg
	.selectAll('path.domain')
	.style('stroke-width', 0)
	
const aziende = svg
	.selectAll('g.stringa')
	.data(data)
	.enter()
	.append('g')
		.attr('class', 'stringa')
		.attr('transform',(d,i) => `translate(${xScale(i)}, ${yScale(d.evasion)})`)
	

const cerchi = aziende
 	.append('circle')
	 	.attr('fill',color1)
 		.attr('r',Radius)
		.attr('cx', wpadding)
		.attr('cy', 0)


const archi = aziende
 	.append('path')
	 	.attr('fill', color2)
		.attr('d', d => describeArc((wpadding), 0, Radius, 0, (d.percControlled * 360)))
		

const testo = svg
        .selectAll('g.testo')
		.data(data)
		.enter()
		.append('g')
			.attr('class', 'testo')
			.attr('transform',(d,i) => `translate(${wpadding+ xScale(i)}, ${yScale(height) +20})`)
			
testo.append("text").text(function(d){ return d.companyType}).style("text-anchor", "middle")


const testo_perc = svg
        .selectAll('g.perc')
		.data(data)
		.enter()
		.append('g')
			.attr('class', 'perc')
			.attr('transform',(d,i) => `translate(${wpadding+ xScale(i)}, ${(yScale(d.evasion)-  Radius-7)})`);
			
testo_perc.append("text").text(function(d) {return bigDecimal.round(""+d.percControlled * 100 +"" , 2) + '%'}).style("text-anchor", "middle")

svg.append("g")
	.attr("transform", "translate(" + `${(width- 75 - wpadding*2)}` + "," + 30 + ")")
	.append("text")
	.attr("font-size", "15px").text("Legenda:")

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width - wpadding*2-12) + "," + ((wpadding/2) + 11) + ")")
	.attr("width", "10")
	.attr("height", "10")
	.attr("fill", '#FF8400')

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width - wpadding*2-12) + "," + ((wpadding/2) - 4) + ")")

	.attr("width", "10")
	.attr("height", "10")
	.attr("fill", '#87CEFA')

svg.append("g")
	.attr("transform", "translate(" + (width - wpadding*2) + "," + ((wpadding/2) +5 ) + ")")
	.append("text")
	.attr("font-size", "12px").text("Controllate")

svg.append("g")
	.attr("transform", "translate(" + (width - wpadding*2)  + "," + ((wpadding/2)+20 ) + ")")
	.append("text")
	.attr("font-size", "12px").text("Non controllate")

console.log(data)



