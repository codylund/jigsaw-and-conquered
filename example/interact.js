function isPointInBounds(point, bounds) {
    return point.x > bounds.left
        && point.x < bounds.right
        && point.y > bounds.top
        && point.y < bounds.bottom;
}

function AnchoredPath(path, maxDrift) {
    this.timeInt = 5;
    this.timeStep = 0;
    this.path = path;
    this.anchor = path.position;
    this.bounds = {
        x : {
            lower: this.anchor.x - maxDrift,
            upper: this.anchor.x + maxDrift
        },
        y : {
            lower: this.anchor.y - maxDrift,
            upper: this.anchor.y + maxDrift
        }
    };
    this.mass = (path.bounds.right - path.bounds.left)*(path.bounds.top - path.bounds.bottom);
}

AnchoredPath.prototype.onFrame = function() {
    this.timeStep += 1;
    if (this.timeStep >= 5) {
        this.float();
        this.timeStep = 0;
    }
}

AnchoredPath.prototype.float = function() {
    var pos = this.path.position;
    
    var x_min = Math.max(pos.x - 3, this.bounds.x.lower);
    var x_max = Math.min(pos.x + 3, this.bounds.x.upper);
    
    var y_min = Math.max(pos.y - 3, this.bounds.y.lower);
    var y_max = Math.min(pos.y + 3, this.bounds.y.upper);

    this.path.position 
        = new Point(getRandom(x_min, x_max), getRandom(y_min, y_max));
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function distance(from, to) {
    return Math.sqrt(Math.pow(from.y - to.y, 2) + Math.pow(from.x - to.x, 2));
}

function PulsingColors(stepSize) {
    this.colors = [];
    this.stepSize = stepSize;
    project.activeLayer.children.forEach((item) => {
        var parentThis = this;
        item.onMouseEnter = function() {
            parentThis.pulse(this.fillColor);
        };
        item.onMouseLeave = function() {
            this.fillColor.stopPulsing = true;
        };
    });	
}

PulsingColors.prototype.pulse = function(color) {
    if (color.pulsing) {
        // This color is already pulsing.
        return;
    }

    // Start pulsing and don't stop until we 
    // are told to do so.
    color.pulsing = true;
    color.stopPulsing = false;
    
    let increasing = true;
    color.pulse = () => {
        if (increasing && color.lightness + this.stepSize <= 1.0) {
            color.lightness += this.stepSize;
        } else if ((!increasing || color.lightness - this.stepSize >= 0.0) 
                && (color.lightness - this.stepSize >= 0)) {
            increasing = false;
            color.lightness -= this.stepSize;
        }
                
        // Have to do this check because of weird rounding issues with 
        // floating-point numbers
        if (color.lightness < this.stepSize) {
            if (color.stopPulsing) {
                color.stopPulsing = false;
                color.pulsing = false;
            } else {
                increasing = true;
            }
        }
    };

    this.colors.push(color);
};

PulsingColors.prototype.onFrame = function() {
    this.colors = this.colors.reduce((acc, color) => {
        if (color && color.pulsing) {
            color.pulse();
            acc.push(color);
        }
        return acc;
    }, []);
};