import React from 'react';
import { Upcoming } from '../components/ui';

const UpcomingDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Upcoming Component Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blue Theme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Blue Theme</h2>
            <Upcoming 
              title="Feature Coming Soon"
              description="This is a sample upcoming feature with blue theme."
              expectedDate="December 2024"
              features={[
                "Feature 1",
                "Feature 2",
                "Feature 3"
              ]}
              colorTheme="blue"
              showProgress={true}
            />
          </div>

          {/* Green Theme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Green Theme</h2>
            <Upcoming 
              title="Service Coming Soon"
              description="This is a sample upcoming service with green theme."
              expectedDate="August 2025"
              features={[
                "Service 1",
                "Service 2",
                "Service 3"
              ]}
              colorTheme="green"
              showProgress={false}
            />
          </div>

          {/* Purple Theme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">Purple Theme</h2>
            <Upcoming 
              title="Blog Coming Soon"
              description="This is a sample upcoming blog with purple theme."
              expectedDate="December 2024"
              features={[
                "Blog Feature 1",
                "Blog Feature 2",
                "Blog Feature 3"
              ]}
              colorTheme="purple"
              showProgress={true}
            />
          </div>

          {/* Orange Theme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">Orange Theme</h2>
            <Upcoming 
              title="Tool Coming Soon"
              description="This is a sample upcoming tool with orange theme."
              expectedDate="August 2025"
              features={[
                "Tool Feature 1",
                "Tool Feature 2",
                "Tool Feature 3"
              ]}
              colorTheme="orange"
              showProgress={true}
            />
          </div>

          {/* Red Theme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Red Theme</h2>
            <Upcoming 
              title="Alert System Coming Soon"
              description="This is a sample upcoming alert system with red theme."
              expectedDate="August 2025"
              features={[
                "Alert Feature 1",
                "Alert Feature 2",
                "Alert Feature 3"
              ]}
              colorTheme="red"
              showProgress={false}
            />
          </div>

          {/* Teal Theme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-teal-600">Teal Theme</h2>
            <Upcoming 
              title="Analytics Coming Soon"
              description="This is a sample upcoming analytics with teal theme."
              expectedDate="February 2025"
              features={[
                "Analytics Feature 1",
                "Analytics Feature 2",
                "Analytics Feature 3"
              ]}
              colorTheme="teal"
              showProgress={true}
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Usage Instructions</h3>
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">
              The Upcoming component can be used as a placeholder for pages that haven't been implemented yet.
            </p>
            <div className="text-left bg-gray-100 p-4 rounded-lg">
              <code className="text-sm text-gray-800">
                {`import { Upcoming } from '../components/ui';

<Upcoming 
  title="Your Title"
  description="Your description"
  expectedDate="Expected Date"
  features={["Feature 1", "Feature 2"]}
  colorTheme="blue"
  showProgress={true}
/>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDemo; 