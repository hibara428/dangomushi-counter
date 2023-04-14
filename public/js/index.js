/**
 * カウントアップ処理
 * 
 * @param {string} name 方角,dog,cat
 */
function countUp(name) {
    if (DIRECTION_NAMES.includes(name)) {
        // 方角カウントアップ
        countUpWithName(name);
        // 合計カウントアップ
        countUpWithName('sum');
    } else if (OTHER_NAMES.includes(name)) {
        // その他カウントアップ
        countUpWithName(name);
    }
}

/**
 * 計測終了処理
 */
function endCount() {
    (async () => {
        try {
            // 累積データの取得
            let beforeTotalData = await getTotalData(bucket, dataKey);
            // 累積データの生成
            let data = updateTotalData(beforeTotalData);
            // 累積データをアップロード
            await uploadTotalData(JSON.stringify(data), bucket, dataKey);
            // 本日データのリセット
            resetAllCounter();
        } catch (error) {
            console.error(error);
            alert('累積データの取得またはアップロードエラー');
        }
    })();
}

/**
 * 指定名のカウントアップ
 * 
 * @param {string} name 方角,"sum","dog","cat"
 */
function countUpWithName(name) {
    let element = document.getElementById(name + '-count');
    element.innerHTML = Number(element.innerHTML) + 1;
}

/**
 * 全カウンターのリセット
 */
function resetAllCounter() {
    COUNTER_NAMES.forEach((name) => {
        resetCounter(name);
    });
}

/**
 * カウンターのリセット
 * 
 * @param {string} name カウンタ名
 */
function resetCounter(name) {
    document.getElementById(name + '-count').innerHTML = 0;
}
