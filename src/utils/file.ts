export function renameFileWithSameExtension(originalFile: File, newBaseName: string): File {
    const originalName = originalFile.name;
    const extension = originalName.substring(originalName.lastIndexOf('.')) || '';
    const newName = `${newBaseName}${extension}`;

    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}