/* ===== Star Class ==============================
|  Class with a constructor for star 			   |
|  ===============================================*/
class Star {
    constructor(data) {
        this.address = data.address;
        this.dec = data.star.dec;
        this.ra = data.star.ra;
        this.story = data.star.story;
        this.storyDecoded = data.star.storyDecoded
    }
}
module.exports = Star;