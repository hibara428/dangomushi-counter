/**
 * 累積データの読み込み
 */
async function loadAndSetTotalData() {
    try {
        let totalData = await getTotalData(bucket, dataKey);
        setTotalData(totalData);
    } catch (error) {
        console.error(error);
        alert('累積データ取得エラー');
    }
}

/**
 * 累積データを表示に反映
 * 
 * @param {object} data 累積データ
 */
function setTotalData(data) {
    if (data.rolyPoly) {
        let rolyPolyData = data.rolyPoly;
        [...DIRECTION_NAMES, SUM_NAME].forEach((direction) => {
            if (!rolyPolyData.totals) {
                return;
            }
            if (rolyPolyData.totals[direction]) {
                document.getElementById(direction + '-total').innerHTML = rolyPolyData.totals[direction];
            }
        });
    }
    if (data.dogs && data.dogs.total) {
        document.getElementById('dog-total').innerHTML = data.dogs.total;
    }
    if (data.cats && data.cats.total) {
        document.getElementById('cat-total').innerHTML = data.cats.total;
    }
}
