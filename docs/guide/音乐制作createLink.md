<%*
const content = tp.file.content; // 获取当前番剧文件的内容
console.log("当前番剧文件内容:", content); // 调试输出：当前番剧文件内容

// 匹配音乐制作人字段，提取音乐制作人名字列表
const regex = /音乐制作人\s*[:：]\s*-?\s*(.*)/; // 允许有或没有 "-" 的情况
const match = content.match(regex);

if (match && match[1]) {
    let directorNames = match[1].trim(); // 获取音乐制作人名字，并去除多余空格
    directorNames = directorNames.replace(/["']/g, ""); // 去掉可能的引号
    console.log("匹配到的音乐制作人列表:", directorNames); // 调试输出：音乐制作人列表

    // 分隔音乐制作人名字，假设用逗号、顿号或换行符分隔
    const namesArray = directorNames.split(/[・,、\n]+/).map(name => name.trim());
    console.log("拆分后的音乐制作人数组:", namesArray);

    // 获取音乐制作人文件夹路径（根据需要修改路径）
    const folderPath = "番剧相关/Anime Element/（动画业界名人堂）/(音乐制作人)/";
    const files = app.vault.getFiles();

    let log = ""; // 用于记录每个音乐制作人的处理结果

    // 遍历每个音乐制作人
    for (const directorName of namesArray) {
        if (!directorName) continue; // 跳过空白名字
        console.log("处理音乐制作人:", directorName); // 调试输出：当前处理的音乐制作人

        let foundFile = null;

        // 检查是否存在对应的音乐制作人文件
        for (const file of files) {
            if (file.path.startsWith(folderPath)) {
                const fileContent = await app.vault.read(file);
                console.log(`检查文件: ${file.name}`); // 调试输出：当前检查的文件名

                const titlePattern = `# 「${directorName}」的音乐作品`;
                const dataviewPattern = `WHERE contains(音乐制作人, "${directorName}")`;

                if (fileContent.includes(titlePattern) || fileContent.includes(dataviewPattern)) {
                    foundFile = file;
                    console.log("找到匹配的文件:", file.name);
                    break;
                }
            }
        }

        if (foundFile) {
            const fileNameWithoutExt = foundFile.name.replace(".md", "");
            const filePath = foundFile.path;
            console.log("目标音乐制作人文件路径:", filePath);

            let fileContent = await app.vault.read(foundFile);
            const dataviewPattern = /```dataview([\s\S]*?)```/;

            const dataviewMatch = fileContent.match(dataviewPattern);

            if (dataviewMatch) {
                const beforeDataview = fileContent.substring(0, dataviewMatch.index + dataviewMatch[0].length);
                const afterDataview = fileContent.substring(dataviewMatch.index + dataviewMatch[0].length);

                if (!fileContent.includes(`[[${tp.file.title}]]`)) {
                    const updatedContent = beforeDataview + `\n\n` + afterDataview + `\n[[${tp.file.title}]]\n`;
                    await app.vault.modify(foundFile, updatedContent);
                    log += `音乐制作人文件 "[[${fileNameWithoutExt}]]" 已存在，已将番剧添加到 [[${fileNameWithoutExt}]] \n`;
                } else {
                    log += `音乐制作人文件 "[[${fileNameWithoutExt}]]" 已存在，但番剧 [[${tp.file.title}]] 已在列表中，无需重复添加。\n`;
                }
            }
        } else {
            const newFileName = `音乐_${directorName}.md`;
            const newFilePath = folderPath + newFileName;

            if (!app.vault.getAbstractFileByPath(newFilePath)) {
                console.log("创建新的音乐制作人文件:", newFilePath);

                // 创建新的文件内容，调整顺序
                const newFileContent = `---
封面链接: 
RGN评分: 
tags: Anime/音乐
---

# 「${directorName}」的音乐作品

\`\`\`dataview
TABLE WITHOUT ID file.link AS "番剧",RGN评分, "<img src='" + 封面链接 + "' style='width:75px;'>" AS 封面
SORT RGN评分 DESC
WHERE contains(音乐制作人, "${directorName}")
\`\`\`

[[${tp.file.title}]]
`;

                await app.vault.create(newFilePath, newFileContent);
                log += `未找到音乐制作人文件：已创建新文件 [[音乐_${directorName}]] 并添加当前番剧。\n`;
            }
        }
    }

    // 输出所有处理结果
    tR += log;
} else {
    tR += `未在当前番剧文件中找到音乐制作人字段。\n`;
}
%>
