export const fetchRarityCards = async ( collectionName ) => {
    try {

        const response = await fetch(`https://wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=${collectionName}&page=1&limit=100&order=desc&sort=name`)
        const json = await response.json()

        return json.data.filter((element) => {
            let cardRarity = element.immutable_data.rarity;
            return cardRarity === '1 of 1' || cardRarity ===  "Legendary" || cardRarity === 'Grail'
        })

    } catch (error) {
        console.error(error)
    }
};
