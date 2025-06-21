const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12 px-4 mt-16">
            <div className="max-w-7xl mx-auto text-center space-y-4">
                <p className="text-gray-600">© {new Date().getFullYear()} Conscience Magazine. All rights reserved.</p>
                <div className="text-sm text-gray-500">
                    <span>Created by </span>
                    <a
                        href="https://originalvondo.github.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-medium"
                    >
                        Tanvirul Islam
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;