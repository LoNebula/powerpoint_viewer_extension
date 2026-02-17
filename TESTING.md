# Testing and Use Cases

## Basic Testing

These are the test procedures to ensure the extension works correctly.

### 1. Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd vscode-powerpoint-viewer

# Install dependencies
npm install

# Compile TypeScript
npm run compile

```

### 2. Launch Extension

1. Open this folder in VS Code
2. Press F5 to launch the Extension Development Host
3. A new VS Code window opens

### 3. Create Test PowerPoint File

Create a simple test PowerPoint file:

1. Open PowerPoint
2. Create the following slides:

**Slide 1:**

* Title: "Test Presentation"
* Body: "This is a test presentation"

**Slide 2:**

* Title: "Feature List"
* Body:
* "Text display"
* "Image display"
* "Scroll display"



**Slide 3:**

* Title: "Image Test"
* Insert one image

3. Save the file as `test.pptx`

### 4. Test Preview

In the Development Host:

1. Open `test.pptx`
2. Right-click the file → "Open With..." → "PowerPoint Preview"
3. Check the following:
* ✅ Filename and slide count are displayed in the header
* ✅ 3 slides are displayed in a vertical scroll (as images)
* ✅ PowerPoint appearance is faithfully reproduced
* ✅ Fonts, colors, and layouts are displayed accurately
* ✅ Images are displayed in high quality
* ✅ Slide numbers are displayed above each slide



## Testing Supported Elements

### Support for All Elements

✅ Full Support:

* All text (titles, body, font styles, colors)
* All images (PNG, JPEG, GIF, BMP)
* Shapes and SmartArt
* Charts and tables
* Animation effects (as static images)
* Transition effects (as static images)

Since LibreOffice fully renders PowerPoint and converts it to PDF, all elements displayed in PowerPoint are faithfully reproduced as images.

### Layout

✅ Full Support:

* All slide layouts
* Master slides
* Themes and designs
* Multiple columns
* SmartArt
* Charts
* All shapes and effects

## Testing Error Cases

### 1. Empty PowerPoint File

Test with a file containing no slides:

* Expected behavior: Error message "No slides found" is displayed

### 2. Corrupted File

Test with a corrupted .pptx file:

* Expected behavior: Appropriate error message is displayed

### 3. Very Large File

Test with a file containing 100+ slides:

* Expected behavior: All slides are displayed correctly and scrolling works smoothly

## Performance Testing

### Memory Usage

```bash
# Check memory usage in VS Code Developer Tools
# Help → Toggle Developer Tools → Memory tab

```

### Loading Time

* 10 slides: < 1 second
* 50 slides: < 3 seconds
* 100 slides: < 5 seconds

(Actual time depends on file size and number of images)

## Debugging

### Checking Console Logs

In VS Code Development Host:

1. Help → Toggle Developer Tools
2. Open Console tab
3. Check for errors or log messages

### Common Issues

**Issue**: Preview is blank
**Solution**:

* Check errors in the Developer Tools Console
* Verify the file is loaded correctly

**Issue**: Images do not appear
**Solution**:

* Ensure image files are embedded within PowerPoint
* Linked images are currently not supported

**Issue**: Text is garbled
**Solution**:

* Check file encoding
* Verify if special characters are handled correctly

## Continuous Improvement

### Collecting Feedback

Points to collect user feedback on:

1. What kind of PowerPoint files are being used
2. Which elements are not displaying correctly
3. Difference between expected and actual behavior

### Future Improvements

In order of priority:

1. Slide zoom function
2. Jump to specific slide
3. Presentation mode
4. Slide search function
5. Improve cache management
6. Optimize conversion speed