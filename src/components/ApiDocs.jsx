import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import swaggerSpec from '../assets/swagger.yaml';  // Updated import path

function ApiDocs() {
  return <SwaggerUI spec={swaggerSpec} />;
}

export default ApiDocs; 