// Used to generate PaperScript for input polygons

"use strict";

module.exports.newPaperScriptBuilder = () => {
    return new PaperScriptBuilder();
};

class PaperScriptBuilder {
    
    constructor() {
        this.count = 0;
        this.names = [];
        this.polygons = [];
        this.function = null;
    }

    addPolygon(polygon, name, fillColor, strokeColor) {
        if (name && this.names.includes(name)) {
            throw new Error(`A polygon named ${name} already exists.`);
        } else if (!name) {
            name = `polygon${this.count++}`;
        } else {
            name = `${name}${this.count++}`;
        }
        
        this.polygons.push(new PolygonBuilder(name, polygon).build());
        return this;
    }

    wrapInFunction(functionName) {
        this.function = functionName;
        return this;
    }

    build() {
        var content = this.polygons.join('\n');
        if (this.function)
            content = `function ${this.function}() { ${content} }`;
        return content;
    }
}

class PolygonBuilder {
    constructor(name, points) {
        this.name = name;
        this.points = points;
        this.strokeColor = 'black';
        this.fillColor = 'black';
    }

    setStrokeColor(color) {
        this.strokeColor = color;
        return this;
    }

    setFillColor(color) {
        this.fillColor = color;
        return this;
    }

    build() {
        return [
            this.getInstationStatement(),
            this.getNameStatement(),
            this.getStrokeColorStatement(),
            this.getFillColorStatement(),
            this.getAddPointsStatement(),
            this.getClosedStatement()
        ].filter((item) => item).join('\n');
    }

    getInstationStatement() {
        return `var ${this.name} = new Path();`;
    }

    getNameStatement() {
        return `${this.name}.country = '${this.name}';`;
    }

    getStrokeColorStatement() {
        if (!this.strokeColor)
            return null;
        return `${this.name}.strokeColor = '${this.strokeColor}';`;
    }

    getFillColorStatement() {
        return `${this.name}.fillColor = '${this.fillColor}';`;
    }

    getAddPointsStatement() {
        let pointStatements = this.points
            .reduce((acc, next) =>{
                // TODO don't hardcode canvas size
                let x = (1200) * (180 + next[0]) / 360;
                let y = (800) * (90 - next[1]) / 180;
                return acc.concat(`new Point(${x}, ${y})`);
            }, [])
            .join();
        return `${this.name}.add(${pointStatements});`;
    }

    getClosedStatement() {
        return `${this.name}.closed = true;`;
    }
}

