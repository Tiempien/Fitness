import axios from 'axios';

class Materialo {
    #cnf = 'cotap-ps'
    #endpoint = 'https://integrate-cotap.materialo.com'
    #scene_ids = new Set()
    async getDataListScenes() {
        let results = await this.getJson(this.#endpoint + `/get_datalist_scenes.php?cnf=${this.#cnf}&skeys=category_master&svals=interior_private`)
        this.#scene_ids = new Set(results.scenes.map(e => e.id))
    }

    async getDatalistMaterials() {
        // https://integrate-cotap.materialo.com/render_img_scene.php?config=cotap-ps&artnr=2630559811&refresh=1&sid=119064&w=2048
    }

    async getJson(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            this.logger.error(`Error fetching JSON: ${error.message}`);
            throw error;

        }
    }
}

const client = new Materialo()
await client.getDataListScenes();
//https://integrate-cotap.materialo.com/get_datalist_scenes.php?cnf=cotap-ps&skeys=category_master&svals=interior_private