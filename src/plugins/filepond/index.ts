const plugin = ({ addFilter, utils }: any) => {
  const whileList = ['.java'];
  // get quick reference to Type utils
  const { Type, isString, replaceInString, guesstimateMimeType, getExtensionFromFilename, getFilenameFromURL } = utils;

  const mimeTypeMatchesWildCard = (mimeType: any, wildcard: any) => {
    const mimeTypeGroup = (/^[^/]+/.exec(mimeType) || []).pop(); // image/png -> image
    const wildcardGroup = wildcard.slice(0, -2); // image/* -> image
    return mimeTypeGroup === wildcardGroup;
  };

  const isValidMimeType = (acceptedTypes: any, userInputType: any) =>
    acceptedTypes.some((acceptedType: any) => {
      // accepted is wildcard mime type

      if (/\*$/.test(acceptedType)) {
        return mimeTypeMatchesWildCard(userInputType, acceptedType);
      }

      // is normal mime type
      return acceptedType === userInputType;
    });

  const getItemType = (item: any) => {
    // if the item is a url we guess the mime type by the extension
    let type = '';
    if (isString(item)) {
      const filename = getFilenameFromURL(item);
      const extension = getExtensionFromFilename(filename);

      if (extension) {
        type = guesstimateMimeType(extension);
      }
    } else {
      type = item.type;
    }

    return type;
  };

  const validateFile = (item: any, acceptedFileTypes: any, typeDetector?: any) => {
    // no types defined, everything is allowed \o/
    if (acceptedFileTypes.length === 0) {
      return true;
    }

    // gets the item type
    const type = getItemType(item);

    // no type detector, test now
    if (!typeDetector) {
      return isValidMimeType(acceptedFileTypes, type);
    }

    // use type detector
    return new Promise((resolve, reject) => {
      typeDetector(item, type)
        .then((detectedType: any) => {
          if (isValidMimeType(acceptedFileTypes, detectedType)) {
            resolve(detectedType);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  };

  const applyMimeTypeMap = (map: any) => (acceptedFileType: any) =>
    map[acceptedFileType] === null ? false : map[acceptedFileType] || acceptedFileType;

  // setup attribute mapping for accept
  addFilter('SET_ATTRIBUTE_TO_OPTION_MAP', (map: any) =>
    Object.assign(map, {
      accept: 'acceptedFileTypes',
    })
  );

  // filtering if an item is allowed in hopper
  addFilter('ALLOW_HOPPER_ITEM', (file: any, { query }: any) => {
    // if we are not doing file type validation exit
    if (!query('GET_ALLOW_FILE_TYPE_VALIDATION')) {
      return true;
    }
    // we validate the file against the accepted file types
    return validateFile(file, query('GET_ACCEPTED_FILE_TYPES'));
  });

  // called for each file that is loaded
  // right before it is set to the item state
  // should return a promise
  addFilter(
    'LOAD_FILE',
    (file: any, { query }: any) =>
      new Promise((resolve, reject) => {
        if (!query('GET_ALLOW_FILE_TYPE_VALIDATION')) {
          resolve(file);
          return;
        }

        const acceptedFileTypes = query('GET_ACCEPTED_FILE_TYPES');

        // custom type detector method
        const typeDetector = query('GET_FILE_VALIDATE_TYPE_DETECT_TYPE');

        // if invalid, exit here
        const validationResult = validateFile(file, acceptedFileTypes, typeDetector);

        const handleRejection = () => {
          const acceptedFileTypesMapped = acceptedFileTypes
            .map(applyMimeTypeMap(query('GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES_MAP')))
            .filter((label: any) => label !== false);

          const acceptedFileTypesMapped_unique = acceptedFileTypesMapped.filter(function (item: any, index: any) {
            return acceptedFileTypesMapped.indexOf(item) === index;
          });

          reject({
            status: {
              main: query('GET_LABEL_FILE_TYPE_NOT_ALLOWED'),
              sub: replaceInString(query('GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES'), {
                allTypes: acceptedFileTypesMapped_unique.join(', '),
                allButLastType: acceptedFileTypesMapped_unique.slice(0, -1).join(', '),
                lastType: acceptedFileTypesMapped_unique[acceptedFileTypesMapped.length - 1],
              }),
            },
          });
        };

        // has returned new filename immidiately
        if (typeof validationResult === 'boolean') {
          if (acceptedFileTypes[0] === whileList[0]) {
            return resolve(file);
          }
          if (!validationResult) {
            return handleRejection();
          }
          return resolve(file);
        }

        // is promise
        validationResult
          .then(() => {
            resolve(file);
          })
          .catch(handleRejection);
      })
  );
  // expose plugin
  return {
    // default options
    options: {
      // Enable or disable file type validation
      allowFileTypeValidation: [true, Type.BOOLEAN],

      // What file types to accept
      acceptedFileTypes: [[], Type.ARRAY],
      // - must be comma separated
      // - mime types: image/png, image/jpeg, image/gif
      // - extensions: .png, .jpg, .jpeg ( not enabled yet )
      // - wildcards: image/*

      // label to show when a type is not allowed
      labelFileTypeNotAllowed: ['File is of invalid type', Type.STRING],

      // nicer label
      fileValidateTypeLabelExpectedTypes: ['Expects {allButLastType} or {lastType}', Type.STRING],

      // map mime types to extensions
      fileValidateTypeLabelExpectedTypesMap: [{}, Type.OBJECT],

      // Custom function to detect type of file
      fileValidateTypeDetectType: [null, Type.FUNCTION],
    },
  };
};

// fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
if (isBrowser) {
  document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', { detail: plugin }));
}

export default plugin;
